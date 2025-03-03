# financial_data/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import (
    prepare_table_data_selected_metrics,
)  # Assuming you place the function in utils.py
from .errors import CompanyDoesNotExistError


class FinancialDataAPIView(APIView):
    def get(self, request, ticker):
        metrics = request.query_params.getlist(
            "metrics"
        )  # Optional query param for custom metrics

        try:
            metric_data, unique_years = prepare_table_data_selected_metrics(
                ticker, metrics
            )
            if not metric_data:
                return Response(
                    {"message": "No data available for the selected metrics."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "metricData": metric_data,
                    "uniqueYears": unique_years,
                }
            )

        except CompanyDoesNotExistError as e:
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
